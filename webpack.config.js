// Файл конфигурации Webpack для сборки проекта "Веб-ларёк"

// Подключаю необходимые зависимости
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin } = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");

// Загружаю переменные окружения из соответствующего .env файла
require('dotenv').config({
  path: path.join(process.cwd(), process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env')
});

// Проверяю, в каком режиме запущен Webpack — production или development
const isProduction = process.env.NODE_ENV == "production";

// Выношу загрузчик стилей отдельно, чтобы было удобно использовать ниже
const stylesHandler = MiniCssExtractPlugin.loader;

// Основной объект конфигурации Webpack
const config = {
  // Точка входа — главный файл TypeScript
  entry: "./src/index.ts",

  // Генерация source-map для отладки
  devtool: "source-map",

  // Куда складываются собранные файлы
  output: {
    path: path.resolve(__dirname, "dist"),
  },

  // Конфигурация dev-сервера
  devServer: {
    open: true, // автоматическое открытие в браузере
    host: "localhost",
    watchFiles: ["src/pages/*.html"], // слежение за изменениями html
    hot: true // поддержка горячей перезагрузки
  },

  // Плагины для сборки
  plugins: [
    // Автоматически вставляет теги со скриптами и стилями в index.html
    new HtmlWebpackPlugin({
      template: "src/pages/index.html"
    }),

    // Вытаскивает стили в отдельные css-файлы
    new MiniCssExtractPlugin(),

    // Добавляю переменные окружения в сборку (например, API_ORIGIN)
    new DefinePlugin({
      'process.env.DEVELOPMENT': !isProduction,
      'process.env.API_ORIGIN': JSON.stringify(process.env.API_ORIGIN ?? '')
    })
  ],

  // Правила обработки различных типов файлов
  module: {
    rules: [
      {
        // Обрабатываю TypeScript и JavaScript
        test: /\.(ts|tsx)$/i,
        use: ["babel-loader", "ts-loader"],
        exclude: ["/node_modules/"],
      },
      {
        // Обработка SCSS: сначала компилируется SCSS → CSS, потом постпроцессинг
        test: /\.s[ac]ss$/i,
        use: [
          stylesHandler,
          "css-loader",
          "postcss-loader",
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: {
                includePaths: ["src/scss"] // подключаю папку со SCSS-файлами
              }
            }
          }
        ],
      },
      {
        // Отдельная обработка обычных CSS-файлов
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        // Обрабатываю шрифты, изображения и svg-файлы
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset", // Webpack сам решает, вставить как base64 или сохранить файл
      },

      // Сюда можно добавить дополнительные загрузчики по мере роста проекта
    ],
  },

  // Указываю расширения файлов, которые можно импортировать без указания расширения
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },

  // Минимизация кода в production-режиме
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        keep_classnames: true, // сохраняю имена классов (нужно для отладки)
        keep_fnames: true      // сохраняю имена функций
      }
    })]
  }
};

// Экспорт конфигурации с определением режима
module.exports = () => {
  config.mode = isProduction ? "production" : "development";
  return config;
};
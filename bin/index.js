#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import child_process from "child_process";
import path from 'path';
import fs from 'fs';

const { spawn } = child_process;

program.version("1.0.3");
let newversion, newauthor, newdescription;
// 注册create命令，name作为参数 指项目名
program.command("create <name>").action((name) => {
  // 获取一些项目信息
  inquirer
    .prompt([
      {
        name: "author",
        message: "你的名字是：",
      },
      {
        name: "version",
        message: "版本号",
        default: "1.0.0",
      },
      {
        name: "description",
        message: "项目描述",
        default: "a package project template with Babel",
      },
      {
        type: 'list',
        name: 'type',
        message: '项目类型',
        default: 'pkg-temp',
        choices: [
          { name: 'pkg-temp', value: 'pkg-temp' },
          { name: 'jspkg-temp', value: 'jspkg-temp' },
          { name: 'mini-temp', value: 'mini-temp' },
        ]        
      }
    ])
    .then((res) => {
      // 拿到信息参数
      const { author, version, description, type } = res;
      newauthor = author;
      newversion = version;
      newdescription = description;
      const beginTime = new Date().getTime();
      console.log(beginTime, "beginTime", type);
      const g = spawn("git", [
        "clone",
        "-b",
        "main",
        `http://39.108.113.20:51110/web-front/${type}.git`,
        `${process.cwd()}/${name}`,
      ]);
      // console.log(g);

      g.stdout.on("data", (data) => {
        
        
      });

      g.on('exit', () => {
        const currentDirectory = process.cwd();

        // 更改package.json 信息
        const packageJsonPath = path.join(currentDirectory, name, 'package.json');
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
        const packageJson = JSON.parse(packageJsonContent);
        packageJson.version = newversion;
        packageJson.author = newauthor;
        packageJson.description = newdescription;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        process.exit(0);
      });
      g.stdout.on("error", (err) => {
        console.log(err, "error");
      });
    });
});

program.parse(process.argv);

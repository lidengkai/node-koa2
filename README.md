## 项目部署

**调试环境**

npm i

npm start

**打包环境**

npm run [dev|test|prod]

## 数据库

- 数据库安装

```bash
## 下载
brew install mysql@5.7
## 配置环境变量
echo 'export PATH=${PATH}:/opt/homebrew/opt/mysql@5.7/bin'>>.zshrc
## 启动
brew services run mysql@5.7
## 自启动
brew services start mysql@5.7
## 设置root密码
mysql_secure_installation
```

- mysql 配置

```sql
-- 查看密码强度
show variables like 'validate_password%';
-- 设置密码强度
set global validate_password_policy = 0/1/2;

-- 创建数据库
create database db_name;
-- 分配用户
grant all privileges on db_name.* to 'user_name'@'localhost' identified by 'user_password';

-- 查看存储过程
SELECT * FROM information_schema.routines WHERE routine_name LIKE 'db_p_%'\G;

-- 查看事件计划(value)
SHOW VARIABLES LIKE '%event_sche%';
-- 开启事件计划
SET GLOBAL event_scheduler = 1;
-- 关闭事件计划
SET GLOBAL event_scheduler = 0;

-- 查看定时任务(status)
SELECT * from information_schema.events WHERE event_name LIKE 'db_e_%'\G;
-- 执行定时任务
ALTER EVENT db_event_name ON COMPLETION PRESERVE ENABLE;
-- 关闭定时任务
ALTER EVENT db_event_name ON COMPLETION PRESERVE DISABLE;
```

## 调试环境

- 前端请求接口

```js
URL: 'http://localhost:port'
```

- 生成建表语句

```js
URL: 'http://localhost:port/routes/table'
```

## webhook

```js
GET: 'http://localhost:port/routes/webhook'
```

## 压测

## 其他

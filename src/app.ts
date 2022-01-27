import koa from 'koa'
import bodyparser from 'koa-bodyparser'
import logger from 'koa-logger'
import json from 'koa-json'
import koaStatic from 'koa-static-server'
import koaSession from 'koa-session'
import koaCors from 'koa2-cors'
import koaError from 'koa-json-error'
import path from 'path'
import { session, publicPath, workspacesPath } from './config'
import './model/api/Test'
import './model/api/User'
import tableRoute from './route/table'
import passwordRoute from './route/password'
import webhookRoute from './route/webhook'
import fileRoute from './route/file'
import userRoute from './route/api/user'
import testRoute from './route/api/test'
import userMockRoute from './route/mock/user'
import testMockRoute from './route/mock/test'

export default async () => {
  const app = new koa()

  app.use(
    koaError({
      postFormat: (e) => {
        return {
          code: e.status,
          message: e?.message,
          data: null,
        }
      },
    })
  )

  app.use(
    koaCors({
      origin: (ctx) => ctx.request.headers.origin ?? '*',
      maxAge: 5,
      credentials: true,
    })
  )

  app.use(
    koaStatic({
      rootDir: publicPath,
      rootPath: '/public',
    })
  )

  app.use(
    koaStatic({
      rootDir: path.join(workspacesPath, 'react-h5-project/dist'),
      rootPath: '/react/h5/project',
    })
  )

  app.use(
    koaStatic({
      rootDir: path.join(workspacesPath, 'react-h5-container/dist'),
      rootPath: '/react/h5',
    })
  )

  app.use(
    koaStatic({
      rootDir: path.join(workspacesPath, 'react-web-project/dist'),
      rootPath: '/react/project',
    })
  )

  app.use(
    koaStatic({
      rootDir: path.join(workspacesPath, 'react-web-container/dist'),
      rootPath: '/react',
    })
  )

  app.use(bodyparser())
  app.use(json())
  app.use(logger())

  app.keys = session.keys
  app.use(koaSession(session.options, app))

  app.use(tableRoute.routes())
  app.use(passwordRoute.routes())
  app.use(webhookRoute.routes())
  app.use(fileRoute.routes())
  app.use(userRoute.routes())
  app.use(testRoute.routes())
  app.use(userMockRoute.routes())
  app.use(testMockRoute.routes())

  app.use(async (ctx) => {
    ctx.response.status = 404
  })

  app.on('error', async (e) => {
    console.log('[error]', e)
  })

  return app
}

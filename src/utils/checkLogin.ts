export default async (ctx: any, next: any) => {
  const { user_id = '' } = ctx.session
  if (user_id) {
    await next()
  } else {
    ctx.response.status = 401
  }
}

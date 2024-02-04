import { test } from 'vitest'
import { getFetchUsersURL } from './index'

test('getFetchUsersURL', async ({ expect }) => {
  const url = getFetchUsersURL({
    page: 1
  })
  expect(url).toBe('https://randomuser.me/api/?results=25&page=1&inc=gender,name,email,location,login,picture,id,dob')
})

test('getFetchUsersURL with results', async ({ expect }) => {
  const url = getFetchUsersURL({
    page: 1,
    results: 10
  })
  expect(url).toBe('https://randomuser.me/api/?results=10&page=1&inc=gender,name,email,location,login,picture,id,dob')
})

test('getFetchUsersURL with results and page', async ({ expect }) => {
  const url = getFetchUsersURL({
    page: 2,
    results: 10
  })
  expect(url).toBe('https://randomuser.me/api/?results=10&page=2&inc=gender,name,email,location,login,picture,id,dob')
})
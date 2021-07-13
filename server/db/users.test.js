const knex = require('knex')
const config = require('./knexfile').test
const testDb = knex(config)

const users = require('./users')

// Prevent Jest from timing out (5s often isn't enough)
jest.setTimeout(10000)

beforeAll(() => {
  return testDb.migrate.latest()
})

beforeEach(() => {
  return testDb.seed.run()
})

afterAll(() => {
  return testDb.destroy()
})

describe('getUserByName', () => {
  it('returns the correct user', () => {
    return users.getUserByName('admin', testDb)
      .then((user) => {
        expect(user.username).toBe('admin')
        expect(user.isAdmin).toBeTruthy()
        expect(user.gardenId).toBe(1)
        expect(user).toHaveProperty('hash')
        expect(user.email).toBe('admin@emailz.co')
        return null
      })
  })
})

describe('createUser', () => {
  it('creates a new user', () => {
    const user = {
      username: 'newuser',
      password: 'hello',
      gardenId: 3,
      email: 'random@emailz.co',
      auth0Id: 'auth0|thisisfortesting'
    }
    return users.createUser(user, testDb)
      .then(() => users.getUserByName('newuser', testDb))
      .then((user) => {
        expect(user.username).toBe('newuser')
        expect(user.isAdmin).toBeFalsy()
        expect(user.gardenId).toBe(3)
        expect(user.email).toBe('random@emailz.co')
        return null
      })
  })
})

describe('userExists', () => {
  it('returns true if user exists', () => {
    return users.userExists('admin', testDb)
      .then((exists) => {
        expect(exists).toBeTruthy()
        return null
      })
  })
  it('returns false if user not found', () => {
    return users.userExists('other-non-existent-user', testDb)
      .then((exists) => {
        expect(exists).toBeFalsy()
        return null
      })
  })
})

describe('get users details by garden', () => {
  it('returns the details of the non admin users in related garden', () => {
    expect.assertions(2)
    return users.getUserDetailsByGarden('1', testDb)
      .then((users) => {
        expect(users).toHaveLength(2)
        expect(users[0].is_admin).toBeFalsy()
        return null
      })
  })
})

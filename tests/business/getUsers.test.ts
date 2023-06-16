import { ZodError } from "zod"
import { UserBusiness } from "../../src/business/UserBusiness"
import { GetUsersSchema } from "../../src/dtos/user/getUsers.dto"
import { USER_ROLES } from "../../src/models/User"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("Testando getUsers", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  )

  test("deve retornar uma lista de users", async () => {
    const input = GetUsersSchema.parse({
      token: "token-mock-astrodev"
    })

    const output = await userBusiness.getUsers(input)

    expect(output).toHaveLength(2)
    expect(output).toContainEqual({
      id: "id-mock-astrodev",
      name: "Astrodev",
      email: "astrodev@email.com",
      createdAt: expect.any(String),
      role: USER_ROLES.ADMIN
    })
  })

  test("Error - token como string vazia", async () => {
    expect.assertions(1)
    try {
      const input = GetUsersSchema.parse({
        token: ""
      })
  
      await userBusiness.getUsers(input)
      
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe('String must contain at least 1 character(s)')
      }
    }
  })

  test("Error - token sendo boleano", async () => {
    expect.assertions(1)
    try {
      const input = GetUsersSchema.parse({
        token: true
      })

      await userBusiness.getUsers(input)

    } catch (error) {
      if (error instanceof ZodError) {
        //console.log(error); para achar a mensagem do zod
        expect(error.issues[0].message).toBe('Expected string, received boolean')
      }
    }
  })
})
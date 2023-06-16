import { ZodError } from "zod"
import { UserBusiness } from "../../src/business/UserBusiness"
import { DeleteUserSchema } from "../../src/dtos/user/deleteUser.dto"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"
import { BadRequestError } from "../../src/errors/BadRequestError"

describe("Testando deleteUser", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  )

  test("deve deletar user", async () => {
    const input = DeleteUserSchema.parse({
      idToDelete: "id-mock-fulano",
      token: "token-mock-fulano"
    })

    const output = await userBusiness.deleteUser(input)

    expect(output).toEqual({
      message: "Deleção realizada com sucesso"
    })
  })

  test("Error - apenas o dono pode deletar o usuário", async () => {
    expect.assertions(2)
    try {
      const input = DeleteUserSchema.parse({
        idToDelete: "id-mock",
        token: "token-mock-fulano"
      })

      await userBusiness.deleteUser(input)

    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("somente quem criou a conta pode deletá-la");
        expect(error.statusCode).toBe(400)
      }
    }
  })

  test("Error - Token inválido", async () => {
    expect.assertions(2)
    try {
      const input = DeleteUserSchema.parse({
        idToDelete: "id-mock-fulano",
        token: "token-falso"
      })

      await userBusiness.deleteUser(input)

    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("token inválido");
        expect(error.statusCode).toBe(400)
      }
    }
  })

})
 
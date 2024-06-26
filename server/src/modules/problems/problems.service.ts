import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common"

/**
 * Import services
 */
import { PrismaService } from "../prisma/prisma.service"
import { ParsersService } from "../parsers/parsers.service"
import { UpdateProblemDto } from "@/validators/update-problem-dto"

@Injectable()
export class ProblemsService {
  constructor(
    private prisma: PrismaService,
    @Inject(ParsersService) private parsersService: ParsersService
  ) {}

  async createProblem({ pid, name, link, difficulty, onlineJudgeId }) {
    try {
      /**
       * check if the problem link is valid
       * if so, then throw an error
       */
      if (!this.parsersService.isValidLink(link))
        throw new BadRequestException("problem link is not valid!")

      /**
       * check if the problem is exist
       * if so, then throw an error
       */
      const foundProblem = await this.prisma.problem.findFirst({
        where: {
          OR: [{ pid: pid.toUpperCase() }, { link }],
        },
      })
      if (foundProblem) throw new BadRequestException("problem already exist!")

      // create a new problem
      return await this.prisma.problem.create({
        data: {
          pid: pid.toUpperCase(),
          name,
          link,
          difficulty: Number(difficulty),
          onlineJudgeId: Number(onlineJudgeId),
        },
      })
    } catch (err) {
      throw new BadRequestException(err.message)
    }
  }

  async getProblem(pid: string) {
    try {
      const problem = await this.prisma.problem.findFirst({
        where: { pid },
        include: {
          tags: {
            select: {
              problemId: true,
              tag: true,
            },
          },
          onlineJudge: true,
        },
      })

      if (!problem) throw new NotFoundException("Problem not found!")

      return problem
    } catch (err) {
      throw err
    }
  }

  async updateProblem({ name, link, difficulty, tags }: UpdateProblemDto, pid: string) {
    try {
      const problem = await this.getProblem(pid)

      // udpate tags
      const dbTags = await this.prisma.problemTag.findMany({
        where: { problemId: problem.id },
        include: { tag: true },
      })

      for (let _ of dbTags) {
        if (!tags.includes(_.tag.name))
          await this.prisma.problemTag.delete({
            where: { problemId_tagId: { problemId: problem.id, tagId: _.tagId } },
          })
      }

      for (let tag of tags) {
        if (!dbTags.map((item) => item.tag.name).includes(tag)) {
          const isFound = await this.prisma.tag.findUnique({ where: { name: tag } })
          let tagId: number
          if (isFound) {
            tagId = isFound.id
          } else {
            const newTag = await this.prisma.tag.create({ data: { name: tag } })
            tagId = newTag.id
          }

          await this.prisma.problemTag.create({ data: { problemId: problem.id, tagId } })
        }
      }

      return await this.prisma.problem.update({
        where: {
          id: problem.id,
        },
        data: {
          pid: problem.pid,
          name,
          link,
          difficulty: Number(difficulty),
          onlineJudgeId: problem.onlineJudgeId,
        },
      })
    } catch (err) {
      throw err
    }
  }

  async deleteProblem(pid: string) {
    try {
      const problem = await this.getProblem(pid)

      // return problem
      return await this.prisma.problem.delete({
        where: {
          id: problem.id,
        },
      })
    } catch (err) {
      throw err
    }
  }

  async getAllProblems() {
    const problems = await this.prisma.problem.findMany({
      include: {
        tags: {
          select: {
            problemId: true,
            tag: true,
          },
        },
        onlineJudge: true,
      },

      orderBy: { createdAt: "asc" },
    })

    return problems
  }
}

// if (upsertTag._count.problems === 0) {
//   await this.prisma.problemTag.create({
//     data: {
//       problemId: problem.id,
//       tagId: upsertTag.id,
//     },
//   })
// }

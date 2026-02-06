import dashboardService from '../dashboard.service'
import apiClient from '../../../../shared/lib/axios'

jest.mock('../../../../shared/lib/axios')

describe('DashboardService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getDashboardAnalytics', () => {
    it('should fetch dashboard analytics successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            totalCourses: 10,
            totalEnrollments: 50,
            totalAssignments: 20,
            totalSubmissions: 15,
          },
        },
      }

      ;(apiClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const result = await dashboardService.getDashboardAnalytics()

      expect(apiClient.get).toHaveBeenCalledWith('/api/analytics/dashboard')
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      if (result.data) {
        expect(result.data.totalCourses).toBe(10)
        expect(result.data.totalEnrollments).toBe(50)
      }
    })

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch analytics')
      ;(apiClient.get as jest.Mock).mockRejectedValue(error)

      await expect(dashboardService.getDashboardAnalytics()).rejects.toThrow(
        'Failed to fetch analytics'
      )
    })
  })

  describe('getCourseAnalytics', () => {
    it('should fetch course-specific analytics', async () => {
      const courseId = 'course123'
      const mockResponse = {
        data: {
          success: true,
          data: {
            enrollments: 25,
            assignments: 10,
            submissions: 8,
          },
        },
      }

      ;(apiClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const result = await dashboardService.getCourseAnalytics(courseId)

      expect(apiClient.get).toHaveBeenCalledWith(`/api/analytics/course/${courseId}`)
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      if (result.data) {
        expect(result.data.enrollments).toBe(25)
      }
    })
  })
})

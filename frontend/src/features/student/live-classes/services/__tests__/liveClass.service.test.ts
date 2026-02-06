import liveClassService from '../liveClass.service'
import apiClient from '../../../../shared/lib/axios'

jest.mock('../../../../shared/lib/axios')

describe('LiveClassService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getLiveClasses', () => {
    it('should fetch live classes successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [
            {
              id: '1',
              title: 'Test Class',
              scheduledAt: '2024-12-25T10:00:00Z',
              meetingLink: 'https://meet.example.com',
            },
          ],
        },
      }

      ;(apiClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const result = await liveClassService.getLiveClasses()

      expect(apiClient.get).toHaveBeenCalledWith('/api/live-classes')
      expect(result).toEqual(mockResponse.data)
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(1)
    })

    it('should handle API errors', async () => {
      const error = new Error('Network error')
      ;(apiClient.get as jest.Mock).mockRejectedValue(error)

      await expect(liveClassService.getLiveClasses()).rejects.toThrow('Network error')
    })
  })

  describe('getLiveClass', () => {
    it('should fetch a single live class by id', async () => {
      const classId = '123'
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: classId,
            title: 'Single Class',
            scheduledAt: '2024-12-25T10:00:00Z',
            meetingLink: 'https://meet.example.com',
          },
        },
      }

      ;(apiClient.get as jest.Mock).mockResolvedValue(mockResponse)

      const result = await liveClassService.getLiveClass(classId)

      expect(apiClient.get).toHaveBeenCalledWith(`/api/live-classes/${classId}`)
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      if (result.data) {
        expect(result.data.id).toBe(classId)
      }
    })
  })

  describe('createLiveClass', () => {
    it('should create a new live class', async () => {
      const newClassData = {
        title: 'New Class',
        scheduledAt: '2024-12-25T10:00:00Z',
        meetingLink: 'https://meet.example.com',
        courseId: 'course123',
      }

      const mockResponse = {
        data: {
          success: true,
          data: { id: 'new123', ...newClassData },
        },
      }

      ;(apiClient.post as jest.Mock).mockResolvedValue(mockResponse)

      const result = await liveClassService.createLiveClass(newClassData)

      expect(apiClient.post).toHaveBeenCalledWith('/api/live-classes', newClassData)
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      if (result.data) {
        expect(result.data.title).toBe(newClassData.title)
      }
    })
  })
})

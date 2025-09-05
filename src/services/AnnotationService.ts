export interface Annotation {
  id: string;
  annotatedImage: AnnotatedImageDto;
  results: ResultsDto;
  success: boolean;
  metadata?: any;
}

export interface AnnotationUploadDto {
    userId: string;
    annotatedImage: AnnotatedImageDto;
    results: ResultsDto;
    success: boolean;
    metadata?: any;
  }

export interface AnnotationUpdateDto {
  results: ResultsDto;
  success: boolean;
  metadata?: any;
}

  export interface AnnotatedImageDto {
    data: string;
    format: string;
  }

  export interface ResultsDto {
    counts: CountsDto;
    detections: DetectionDto[];
    summary: SummaryDto;
  }

  export interface CountsDto {
    'Mature(Dead)': number;
    'Mature(Healthy)': number;
    'Mature(Yellow)': number;
    'grass': number;
    'young': number;
  }

  export interface DetectionDto {
    bbox: number[];
    class: string;
    confidence: number;
  }

  export interface SummaryDto {
    totalMature: number;
    totalPalms: number;
    totalYoung: number;
  }

  export class AnnotationService {
    private API_BASE = import.meta.env.VITE_API_URL || "https://localhost:7024";

    private getToken(): string | null {
      return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    }

    async uploadAnnotation(annotationData: AnnotationUploadDto): Promise<Annotation> {
      const token = this.getToken();
      if (!token) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch(`${this.API_BASE}/api/Annotations/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(annotationData)
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Failed to upload annotation (${response.status}): ${text || response.statusText}`);
      }

      return response.json();
    }

    async getAnnotations(): Promise<Annotation[]> {
      const token = this.getToken();
      if (!token) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch(`${this.API_BASE}/api/Annotations`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Failed to get annotations (${response.status}): ${text || response.statusText}`);
      }

      return response.json();
    }

    async getAnnotation(id: string): Promise<Annotation> {
      const token = this.getToken();
      if (!token) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch(`${this.API_BASE}/api/Annotations/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Failed to get annotation (${response.status}): ${text || response.statusText}`);
      }

      return response.json();
    }

    async updateAnnotationMetadata(id: string, data: AnnotationUpdateDto): Promise<Annotation> {
      const token = this.getToken();
      if (!token) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch(`${this.API_BASE}/api/Annotations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Failed to update annotation metadata (${response.status}): ${text || response.statusText}`);
      }

      return response.json();
    }
  }

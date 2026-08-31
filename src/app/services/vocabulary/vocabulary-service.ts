import { Injectable } from '@angular/core';
import { API_BASE } from '../../api-config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Word {
  id: number;
  word: string;
  definition: string;
  example?: string;
  additionalInfo?: string;
  isLearned: boolean;
  createdAt: string;
}

export interface CreateWordDto {
  word: string;
  definition: string;
  example?: string;
  additionalInfo?: string;
}

@Injectable({
  providedIn: 'root',
})
export class VocabularyService {
  private readonly apiBase = `${API_BASE}/api/vocabulary`;

  constructor(private http: HttpClient) {}

  getWords(): Observable<Word[]> {
    return this.http.get<Word[]>(this.apiBase);
  }

  getWord(id: number): Observable<Word> {
    return this.http.get<Word>(`${this.apiBase}/${id}`);
  }

  addWord(dto: CreateWordDto): Observable<Word> {
    return this.http.post<Word>(this.apiBase, dto);
  }

  setLearned(id: number, isLearned: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiBase}/${id}/learned`, { isLearned });
  }

  deleteWord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/${id}`);
  }
}

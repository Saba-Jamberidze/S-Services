import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VocabularyService, Word } from '../services/vocabulary/vocabulary-service';

@Component({
  selector: 'app-word-page',
  imports: [],
  templateUrl: './word-page.html',
  styleUrl: './word-page.scss',
})
export class WordPage implements OnInit {
  wordDetails: Word | null = null;

  saba = "saba";
  gio = "gio";

  constructor(
    private route: ActivatedRoute,
    private vocabularyService: VocabularyService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.vocabularyService.getWord(id).subscribe({
      next: (word) => {
        this.wordDetails = word;
      },
      error: (error) => console.error(error),
    });
  }
}
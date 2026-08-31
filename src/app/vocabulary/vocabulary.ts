import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VocabularyService, Word } from '../services/vocabulary/vocabulary-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vocabulary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vocabulary.html',
  styleUrl: './vocabulary.scss',
})
export class Vocabulary implements OnInit {
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  wordfilter = 'All Words';

  words: Word[] = [];
  loading = false;
  errorMessage = '';

  searchTerm = '';
  searchResults: Word[] = [];

  isAsideOpen = false;
  isSearchOpen = false;
  isFilterOpen = false;
  isAddWordOpen = false;

  private emptyWord = () => ({
    word: '',
    definition: '',
    example: '',
    additionalInfo: '',
  });

  newWord = this.emptyWord();

  constructor(
    private vocabularyService: VocabularyService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWords();
  }

  openSearch(): void {
    this.isSearchOpen = true;
    this.isFilterOpen = false;
  }

  openFilters(): void {
    this.isFilterOpen = true;
    this.isSearchOpen = false;
  }

  loadWords(): void {
    this.loading = true;
    this.errorMessage = '';

    this.vocabularyService.getWords().subscribe({
      next: (data) => {
        this.words = data;
        this.loading = false;
        this.onSearchChange();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'სიტყვების ჩატვირთვა ვერ მოხერხდა.';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  changeFilter(filter: string): void {
    this.wordfilter = filter;
    this.isFilterOpen = false;
    this.isAsideOpen = false;
    this.cdr.markForCheck();
  }

  private getLetter(w: Word): string {
    return w.word.charAt(0).toUpperCase();
  }

  get filteredWords(): Word[] {
    if (this.wordfilter === 'All Words') return this.words;

    if (this.wordfilter === 'Learned') {
      return this.words.filter((w) => w.isLearned);
    }

    if (this.wordfilter === 'Not Learned') {
      return this.words.filter((w) => !w.isLearned);
    }

    return this.words.filter((w) => this.getLetter(w) === this.wordfilter);
  }

  get uniqueLetters(): string[] {
    return [...new Set(this.filteredWords.map((w) => this.getLetter(w)))].sort();
  }

  wordsByLetter(letter: string): Word[] {
    return this.filteredWords
      .filter((w) => this.getLetter(w) === letter)
      .sort((a, b) => a.word.localeCompare(b.word));
  }

  addNewWord(): void {
    if (!this.newWord.word || !this.newWord.definition) return;

    this.errorMessage = '';

    this.vocabularyService.addWord(this.newWord).subscribe({
      next: (created) => {
        this.words = [...this.words, created];
        this.newWord = this.emptyWord();
        this.onSearchChange();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'სიტყვის დამატება ვერ მოხერხდა.';
        this.cdr.markForCheck();
      },
    });
  }

  toggleLearned(w: Word): void {
    const newValue = !w.isLearned;
    this.errorMessage = '';

    this.vocabularyService.setLearned(w.id, newValue).subscribe({
      next: () => {
        this.words = this.words.map((word) =>
          word.id === w.id ? { ...word, isLearned: newValue } : word
        );

        this.onSearchChange();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'სტატუსის განახლება ვერ მოხერხდა.';
        this.cdr.markForCheck();
      },
    });
  }

  removeWord(w: Word): void {
    this.errorMessage = '';

    this.vocabularyService.deleteWord(w.id).subscribe({
      next: () => {
        this.words = this.words.filter((word) => word.id !== w.id);
        this.onSearchChange();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'წაშლა ვერ მოხერხდა.';
        this.cdr.markForCheck();
      },
    });
  }

  onSearchChange(): void {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.searchResults = [];
      return;
    }

    this.searchResults = this.words.filter(
      (w) =>
        w.word.toLowerCase().includes(term) ||
        w.definition.toLowerCase().includes(term)
    );
  }

  
  navigateToWordPage(word: any) {
    this.router.navigate(['/word', word.id]);
  }
}
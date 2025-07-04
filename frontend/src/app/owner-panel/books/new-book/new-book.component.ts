import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { debounceTime } from "rxjs";
import { GlobalConfigService } from "src/app/global-config.service";
import { BookService } from "src/app/services/book.service";
import { Category } from "src/interfaces/category.model";
import Swal from "sweetalert2";
// storing the entered values
let initialFormValue: any = {};
const savedBookForm = localStorage.getItem("book-register-form");
if (savedBookForm) {
  try {
    initialFormValue = JSON.parse(savedBookForm);
  } catch (error) {
    console.error("Error parsing saved register form:", error);
    initialFormValue = {}; // Fallback to an empty object if parsing fails
  }
}
@Component({
  selector: "app-new-book",
  templateUrl: "./new-book.component.html",
  styleUrls: ["./new-book.component.css"],
})
export class NewBookComponent {
  private bookService = inject(BookService);
  private router = inject(Router);

  constructor(private config: GlobalConfigService) {}
  // storing error message
  errorMessage: string = "";
  // categories stored here;
  categories: Category[] = [];
  bookStatuses: any[] = [];
  // status values
  statusList: string[] = ["mavjud", "ijarada"];

  // declaring bookForm
  bookForm = new FormGroup({
    title: new FormControl(initialFormValue.title || "", {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    author: new FormControl(initialFormValue.author || "", {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    isbn: new FormControl(initialFormValue.isbn || "", {
      validators: [Validators.required],
    }),
    publication_date: new FormControl(initialFormValue.publication_date || "", {
      validators: [Validators.required],
    }),
    category_id: new FormControl(initialFormValue.category_id || "", {
      validators: [Validators.required],
    }),
    status_id: new FormControl(initialFormValue.status_id || "", {
      validators: [Validators.required],
    }),
    image: new FormControl(null, {}),
  });

  ngOnInit(): void {
    this.bookForm.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value) => {
        window.localStorage.setItem(
          "book-register-form",
          JSON.stringify({
            title: value.title,
            author: value.author,
            isbn: value.isbn,
            publication_date: value.publication_date,
            category: value.category_id,
            status: value.status_id,
          })
        );
      },
    });
    this.fetchCategories();
    this.fetchBookStatuses();
  }

  // get Categories
  fetchCategories() {
    this.config.loadCategories().subscribe({
      next: (res) => {
        // console.log(cats);
        this.categories = res.categories;
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
      complete: () => {
        this.bookForm.reset();
      },
    });
  }

  // get Categories
  fetchBookStatuses() {
    this.config.getBookStatuses().subscribe({
      next: (res) => {
        // console.log(cats);
        this.bookStatuses = res.bookStatuses;
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
      complete: () => {
        this.bookForm.reset();
      },
    });
  }

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      //preview
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }
  // sending data to backend via bookService
  onSubmit() {
    if (this.bookForm.invalid) {
      this.errorMessage = "Kerakli Malumotlar kiritilishi shart!";
      return;
    }
    const fd = new FormData();
    // append all your text fields in one go
    Object.entries(this.bookForm.value).forEach(([key, val]) => {
      if (key !== "image") {
        fd.append(key, val as string);
      }
    });

    // then append the file, if any
    if (this.selectedFile) {
      // the first argument must match your server’s upload.single('…') field name
      fd.append("image", this.selectedFile, this.selectedFile.name);
    }

    // console.log('Book form ', this.bookForm.value);
    this.bookService.addNewBook(fd).subscribe({
      next: () => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Yangi Kitob qo'shildi!",
        }).then(() => {
          this.router.navigate(["/owner-panel/library/books"]);
          window.localStorage.removeItem("book-register-form");

          this.bookService.getBooks();
        });
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });
  }
}

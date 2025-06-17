import { Component, inject } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalConfigService } from "src/app/global-config.service";
import { BookService } from "src/app/services/book.service";
import { Category } from "src/interfaces/category.model";
import Swal from "sweetalert2";

let bookCategoryId: string | undefined = "";
@Component({
  selector: "app-update-book",
  templateUrl: "./update-book.component.html",
  styleUrls: ["./update-book.component.css"],
})
export class UpdateBookComponent {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private config = inject(GlobalConfigService);

  categories: Category[] = [];
  bookId!: string;
  errorMessage: string = "";
  // status values
  statusList: any[] = [];
  form!: FormGroup;

  //

  //
  ngOnInit(): void {
    // check if book id is available
    this.bookId = this.route.snapshot.paramMap.get("bookId") || "";
    this.form = this.fb.group({
      title: ["", [Validators.required]],
      author: ["", [Validators.required]],
      isbn: ["", [Validators.required]],
      publication_date: ["", [Validators.required]],
      category_id: ["", [Validators.required]],
      status_id: ["", [Validators.required]],
      image: new FormControl(null, {}),
    });

    this.bookService.getBookById(this.bookId).subscribe({
      next: (res) => {
        this.form.patchValue({
          ...res.book,
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.error || "Kitob topilmadi.";
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
    });
  }

  // get Categories
  fetchBookStatuses() {
    this.config.getBookStatuses().subscribe({
      next: (res) => {
        // console.log(cats);
        this.statusList = res.bookStatuses;
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });
  }

  // get selected file as File type
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
  //
  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = "Kerakli Malumotlar kiritilishi shart";
      return;
    }

    const fd = new FormData();
    // append all your text fields in one go

    // 2) Append text fields from the form
    const { title, author, isbn, publication_date, category_id, status_id } =
      this.form.value;

    fd.append("title", title);
    fd.append("author", author);
    fd.append("isbn", isbn);
    fd.append("publication_date", publication_date);
    fd.append("category_id", category_id);
    fd.append("status_id", status_id);

    if (this.selectedFile) {
      // the first argument must match your server’s upload.single('…') field name
      fd.append("image", this.selectedFile, this.selectedFile.name);
    }
    this.bookService.updateBook(this.bookId, fd).subscribe({
      next: () => {
        Swal.showLoading();
        Swal.fire("Success!", "Kitob tahrirlandi!", "success").then(() => {
          this.router.navigate(["owner-panel/library/books"]);
        });
        this.bookService.getBooks();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || "Xatolik tahrirlashda";
      },
    });
  }
}

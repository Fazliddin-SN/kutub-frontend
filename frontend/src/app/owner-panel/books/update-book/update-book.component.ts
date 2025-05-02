import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalConfigService } from "src/app/global-config.service";
import { BookService } from "src/app/services/book.service";
import { Category } from "src/interfaces/category.model";
import Swal from "sweetalert2";

let bookCategoryName: string | undefined = "";
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
  private globalConfService = inject(GlobalConfigService);

  categories: Category[] = [];
  bookId!: string;
  errorMessage: string = "";
  // status values
  statusList: string[] = ["mavjud", "ijarada"];
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
      category: [bookCategoryName, [Validators.required]],
      image: [null, [Validators.required]],
      status: ["", [Validators.required]],
    });
    // get Categories
    this.globalConfService.categories$.subscribe({
      next: (cats) => {
        // console.log(cats);
        this.categories = cats;
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });
    // fectching book data from backend

    this.bookService.getBookById(this.bookId).subscribe({
      next: (res) => {
        console.log("res book ", res.book);

        bookCategoryName = this.categories.find(
          (c) => c.category_id === res.book.category_id
        )?.category_name;
        this.form.patchValue({
          ...res.book,
          image: res.book.image_path,
          category: bookCategoryName,
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.error || "Kitob topilmadi.";
      },
    });
  }
  // get selected file as File type
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
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
    const { title, author, isbn, publication_date, category, status } =
      this.form.value;
    fd.append("title", title);
    fd.append("author", author);
    fd.append("isbn", isbn);
    fd.append("publication_date", publication_date);
    fd.append("category", category);
    fd.append("status", status);

    if (this.selectedFile) {
      // the first argument must match your server’s upload.single('…') field name
      fd.append("image", this.selectedFile, this.selectedFile.name);
    }
    this.bookService.updateBook(this.bookId, fd).subscribe({
      next: () => {
        Swal.fire("Success!", "Kitob tahrirlandi!", "success").then(() => {
          this.router.navigate(["owner-panel/library/books"]);
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.error || "Xatolik tahrirlashda";
      },
    });
  }
}

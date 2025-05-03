import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth-service";
import Swal from "sweetalert2";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.css"],
})
export class EditProfileComponent implements OnInit {
  form!: FormGroup;
  avatarPreview: string | ArrayBuffer | null = null;
  laoding = false;
  errorMessage: string = "";
  router = inject(Router);
  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    // build the form
    this.form = this.fb.group({
      full_name: ["", [Validators.required, Validators.minLength(4)]],
      phonenumber: ["", [Validators.required]],
      address: ["", [Validators.required, Validators.minLength(4)]],
      avatar: [null, [Validators.required]],
    });

    this.authService.getUserDetails().subscribe({
      next: (res) => {
        this.form.patchValue({
          full_name: res.user.full_name,
          phonenumber: res.user.phonenumber,
          address: res.user.address,
        });
        this.avatarPreview = res.user.avatarUrl;
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });
  }
  selectedFile: File | null = null;
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files.length) return;
    this.selectedFile = input.files[0];
    //preview
    const reader = new FileReader();
    reader.onload = () => (this.avatarPreview = reader.result);
    reader.readAsDataURL(this.selectedFile);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = "Kerakli malumotlar kiritilishi shart!";
      return;
    }
    this.laoding = true;

    // prepare FormData for multipart upload
    const data = new FormData();
    data.append("full_name", this.form.value.full_name);
    data.append("phonenumber", this.form.value.phonenumber);
    data.append("address", this.form.value.address);

    if (this.selectedFile) {
      data.append("avatar", this.selectedFile, this.selectedFile.name);
    }
    this.authService.updateUser(data).subscribe({
      next: (res) => {
        Swal.fire({
          icon: "success",
          text: "Malumotlar tahrirlandi",
          showConfirmButton: true,
        }).then(() => {
          this.router.navigate(["/dashboard"]);
        });
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });
  }
}

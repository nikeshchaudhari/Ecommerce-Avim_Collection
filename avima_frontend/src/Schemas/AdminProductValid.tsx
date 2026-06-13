import * as Yup from "yup";

export const AdminProduct = Yup.object({
photos: Yup.array()
    .of(Yup.mixed())
    .min(1, "At least 1 photo required")
    .max(5, "Maximum 5 photos allowed")

    // ✅ FILE SIZE CHECK (2MB)
    .test("fileSize", "Each image must be less than 2MB", (value:any) => {
      if (!value) return true;
      return value.every((file:any) => file.size <= 2 * 1024 * 1024);
    })

    // ✅ FILE TYPE CHECK (JPG/PNG/JPEG only)
    .test("fileType", "Only JPG, JPEG, PNG allowed", (value:any) => {
      if (!value) return true;

      return value.every((file:any) =>
        ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
      );
    }),
name:Yup.string().min(2).max(30).required("Name required"),
slug:Yup.string().min(2).max(30).required("Slug required"),
category:Yup.string().required("Category required"),
gender:Yup.string().min(2).max(30).required("Gender required"),
stock: Yup.number()
    .typeError("Stock must be a number")
    .required("Stock required")
    .min(0, "Stock cannot be negative"),

  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price required")
    .min(1, "Price must be greater than 0"),
})
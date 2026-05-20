"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/shared/form-input";
import { SubmitButton } from "@/components/shared/submit-button";
import { Form } from "@/components/ui/form";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-categories";
import {
  categorySchema,
  type CategoryFormValues,
} from "@/lib/validations";

interface CategoryFormProps {
  mode?: "create" | "edit";
  categoryId?: string;
  defaultValues?: CategoryFormValues;
  onSuccess?: () => void;
}

export function CategoryForm({
  mode = "create",
  categoryId,
  defaultValues,
  onSuccess,
}: CategoryFormProps) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory(categoryId ?? "");
  const isEdit = mode === "edit" && !!categoryId;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues ?? { name: "" },
  });

  const onSubmit = (values: CategoryFormValues) => {
    if (isEdit) {
      updateCategory.mutate(values, { onSuccess });
    } else {
      createCategory.mutate(values, {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      });
    }
  };

  const isPending = createCategory.isPending || updateCategory.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 sm:flex-row sm:items-end"
      >
        <FormInput
          control={form.control}
          name="name"
          label="Category name"
          placeholder="e.g. technology"
          className="flex-1"
          disabled={isPending}
        />
        <SubmitButton isLoading={isPending}>
          {isEdit ? "Save Category" : "Add Category"}
        </SubmitButton>
      </form>
    </Form>
  );
}

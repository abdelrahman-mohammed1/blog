"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/shared/form-input";
import { SubmitButton } from "@/components/shared/submit-button";
import { Form } from "@/components/ui/form";
import { useCreateCategory } from "@/hooks/use-categories";
import {
  categorySchema,
  type CategoryFormValues,
} from "@/lib/validations";

export function CategoryForm() {
  const createCategory = useCreateCategory();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (values: CategoryFormValues) => {
    createCategory.mutate(values, {
      onSuccess: () => form.reset(),
    });
  };

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
          disabled={createCategory.isPending}
        />
        <SubmitButton isLoading={createCategory.isPending}>
          Add Category
        </SubmitButton>
      </form>
    </Form>
  );
}

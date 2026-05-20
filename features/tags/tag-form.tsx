"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/shared/form-input";
import { SubmitButton } from "@/components/shared/submit-button";
import { Form } from "@/components/ui/form";
import { useCreateTag, useUpdateTag } from "@/hooks/use-tags";
import { tagSchema, type TagFormValues } from "@/lib/validations";

interface TagFormProps {
  mode?: "create" | "edit";
  tagId?: string;
  defaultValues?: TagFormValues;
  onSuccess?: () => void;
}

export function TagForm({
  mode = "create",
  tagId,
  defaultValues,
  onSuccess,
}: TagFormProps) {
  const createTag = useCreateTag();
  const updateTag = useUpdateTag(tagId ?? "");
  const isEdit = mode === "edit" && !!tagId;

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: defaultValues ?? { name: "" },
  });

  const onSubmit = (values: TagFormValues) => {
    if (isEdit) {
      updateTag.mutate(values, { onSuccess });
    } else {
      createTag.mutate(values, {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      });
    }
  };

  const isPending = createTag.isPending || updateTag.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 sm:flex-row sm:items-end"
      >
        <FormInput
          control={form.control}
          name="name"
          label="Tag name"
          placeholder="e.g. tutorial"
          className="flex-1"
          disabled={isPending}
        />
        <SubmitButton isLoading={isPending}>
          {isEdit ? "Save Tag" : "Add Tag"}
        </SubmitButton>
      </form>
    </Form>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/shared/form-input";
import { ImageUpload } from "@/components/shared/image-upload";
import { MultiSelectBadges } from "@/components/shared/multi-select-badges";
import { SubmitButton } from "@/components/shared/submit-button";
import { RichTextEditor } from "@/features/posts/rich-text-editor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCategories } from "@/hooks/use-categories";
import { useCreatePost, useUpdatePost } from "@/hooks/use-posts";
import { useTags } from "@/hooks/use-tags";
import { getCategoryIds, getTagIds, resolveImageUrl } from "@/lib/post-utils";
import { ROUTES } from "@/lib/constants";
import {
  postCreateSchema,
  postUpdateSchema,
  type PostCreateFormValues,
  type PostUpdateFormValues,
} from "@/lib/validations";
import type { Post } from "@/types/post";

interface PostFormProps {
  mode?: "create" | "edit";
  post?: Post;
}

export function PostForm({ mode = "create", post }: PostFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit" && !!post;
  const createPost = useCreatePost();
  const updatePost = useUpdatePost(post?._id ?? "");
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    limit: 100,
    page: 1,
  });
  const { data: tagsData, isLoading: tagsLoading } = useTags({
    limit: 100,
    page: 1,
  });

  const categories = categoriesData?.data ?? [];
  const tags = tagsData?.data ?? [];
  const isPending = createPost.isPending || updatePost.isPending;

  const form = useForm<PostCreateFormValues | PostUpdateFormValues>({
    resolver: zodResolver(isEdit ? postUpdateSchema : postCreateSchema),
    defaultValues: isEdit
      ? {
          title: post.title,
          content: post.content,
          categories: getCategoryIds(post),
          tags: getTagIds(post),
          image: null,
        }
      : {
          title: "",
          content: "",
          categories: [],
          tags: [],
          image: undefined,
        },
  });

  useEffect(() => {
    if (isEdit && post) {
      form.reset({
        title: post.title,
        content: post.content,
        categories: getCategoryIds(post),
        tags: getTagIds(post),
        image: null,
      });
    }
  }, [post, isEdit, form]);

  const selectedCategories = form.watch("categories");
  const selectedTags = form.watch("tags");

  const toggleCategory = (id: string) => {
    const current = form.getValues("categories");
    form.setValue(
      "categories",
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id],
      { shouldValidate: true },
    );
  };

  const toggleTag = (id: string) => {
    const current = form.getValues("tags");
    form.setValue(
      "tags",
      current.includes(id) ? current.filter((t) => t !== id) : [...current, id],
      { shouldValidate: true },
    );
  };

  const onSubmit = (values: PostCreateFormValues | PostUpdateFormValues) => {
    if (isEdit) {
      updatePost.mutate(
        {
          title: values.title,
          content: values.content,
          categories: values.categories,
          tags: values.tags,
          image: values.image ?? undefined,
        },
        { onSuccess: () => router.push(ROUTES.post(post._id)) },
      );
    } else {
      const createValues = values as PostCreateFormValues;
      if (!createValues.image) return;
      createPost.mutate(
        {
          title: createValues.title,
          content: createValues.content,
          categories: createValues.categories,
          tags: createValues.tags,
          image: createValues.image,
        },
        { onSuccess: () => router.push(ROUTES.posts) },
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-8"
      >
        <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm backdrop-blur-md sm:p-8">
          <FormInput
            control={form.control}
            name="title"
            label="Title"
            placeholder="Post title"
            disabled={isPending}
          />
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm backdrop-blur-md sm:p-8">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value as File | null | undefined}
                    previewUrl={isEdit ? resolveImageUrl(post?.image) : null}
                    onChange={(file) => field.onChange(file)}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm backdrop-blur-md sm:p-8">
          <FormField
            control={form.control}
            name="categories"
            render={() => (
              <FormItem>
                <FormLabel>Categories</FormLabel>
                <FormControl>
                  <MultiSelectBadges
                    items={categories}
                    selected={selectedCategories}
                    onToggle={toggleCategory}
                    loading={categoriesLoading}
                    emptyMessage="No categories available. Create one first."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm backdrop-blur-md sm:p-8">
          <FormField
            control={form.control}
            name="tags"
            render={() => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <MultiSelectBadges
                    items={tags}
                    selected={selectedTags}
                    onToggle={toggleTag}
                    loading={tagsLoading}
                    emptyMessage="No tags available. Create one first."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm backdrop-blur-md sm:p-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <SubmitButton
            isLoading={isPending}
            disabled={tagsLoading || categoriesLoading}
          >
            {isEdit ? "Save Changes" : "Publish Post"}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}

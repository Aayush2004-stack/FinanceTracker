import type { NextFunction, Request, Response } from "express";
import * as categoryService from "../services/categoryService";
import { HttpError } from "../utils/errors";

export async function createCategory(
  req: Request,
  res: Response,
  next: Function,
) {
  try {
    const user_id = req.user?.userId;
    const { name, description } = req.body;
    const category = await categoryService.createCategory({
      user_id,
      name,
      description,
    });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

export async function getAllCategories(
  req: Request,
  res: Response,
  next: Function,
) {
  try {
    const user_id = req.user?.userId;
    if (!user_id) {
      return next(new HttpError(401, "Unauthorized user!"));
    }
    const categories = await categoryService.getAllCategories(user_id);
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
}

export async function getCategoryById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const user_id = req.user?.userId;
    const id = req.params.id;

    if (!user_id) {
      return next(new HttpError(401, "Unauthorized user!"));
    }

    if (!id) {
      return next(new HttpError(400, "Category id is required!"));
    }

    const category = await categoryService.getCategoryById(id, user_id);
    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const user_id = req.user?.userId;
    const id = req.params.id;

    const { name, description } = req.body;

    if (!user_id) {
      return next(new HttpError(401, "Unauthorized user!"));
    }

    const updatedCategory = await categoryService.updateCategory({
      id,
      user_id,
      name,
      description,
    });
    res.status(200).json(updatedCategory);
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const user_id = req.user?.userId;
    const id = req.params.id;

    if (!user_id) {
      return next(new HttpError(401, "Unauthorized user!"));
    }

    const result = await categoryService.deleteCategory(id, user_id);
    res.status(200).json(result);

  } catch (err) {
    next(err);
  }
}

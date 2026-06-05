import {Request, Response, NextFunction} from 'express';
import { createArea, getAllAreas, getAreaById, updateArea, deleteArea } from '../services/areaService';
import { HttpError } from '../utils/errors';

export async function addArea(req: Request, res: Response, next: NextFunction){
    try{
        const userId = req.user?.userId!;//non null assertion because this route is protected by auth middleware
        const {name, description} = req.body;
        if(!name?.trim()){
            throw new HttpError(400, "Area name is required!"); 
        }
        const result = await createArea({userId, name, description});
        return res.status(201).json(result);
    }
    catch(err){
        next(err);
    }
}

export async function removeArea(req: Request, res: Response, next: NextFunction){
    try{
        const userId = req.user?.userId!;
        const id = req.params.id as string; 
        if(!id){
            throw new HttpError(400, "Area id is required!");
        }
        await deleteArea({id , userId});
        return res.status(204).send();
    }
    catch(err){
        next(err);
    }
}

export async function editArea(req: Request, res: Response, next: NextFunction){
    try{
        const userId = req.user?.userId!;
        const id = req.params.id as string; 
        const {name, description} = req.body;
        if(!id){
            throw new HttpError(400, "Area id is required!");
        }
        if(!name?.trim() && !description?.trim()){
            throw new HttpError(400, "At least one field is required to update!");
        }
        const result = await updateArea({id, userId, name, description});
        return res.status(200).json(result);
    }
    catch(err){
        next(err);
    }       
}

export async function fetchAllAreas(req: Request, res: Response, next: NextFunction){
    try{
        const userId = req.user?.userId!;
        const result = await getAllAreas(userId);
        return res.status(200).json(result);
    }
    catch(err){
        next(err);
    }
}

export async function fetchAreaById(req: Request, res: Response, next: NextFunction){
    try{
        const userId = req.user?.userId!;
        const id = req.params.id as string; 
        if(!id){
            throw new HttpError(400, "Area id is required!");
        }
        const result = await getAreaById(id, userId);
        return res.status(200).json(result);
    }
    catch(err){
        next(err);
    }   
}

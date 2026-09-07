import express from 'express';
import {
    ajouterRecommendation,
    listerRecommendations,
    listerRecommendationsByStudent,
    getbyIdRecommendation,
    updateRecommendation,
    deleteRecommendation,
    markRecommendationAsRead,
    markAllRecommendationsAsRead,
    getRecommendations,
    createRecommendations,
} from '../controllers/recommendationController.js';

const router = express.Router();

router.post('/ajouter', ajouterRecommendation);
router.get('/lister', listerRecommendations);
router.get('/student/:studentId', getRecommendations);
router.put('/read-all', markAllRecommendationsAsRead);
router.post('/generate', createRecommendations);

router.get('/:id', getbyIdRecommendation);
router.put('/:id', updateRecommendation);
router.put('/:id/read', markRecommendationAsRead);
router.delete('/:id', deleteRecommendation);

export default router;
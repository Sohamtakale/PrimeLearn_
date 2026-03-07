import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getLearnerId = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('learner_id');
    }
    return null;
};

export const setLearnerId = (id) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('learner_id', id);
    }
};

const handleResponse = async (request) => {
    try {
        const response = await request;
        return { data: response.data, error: null };
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        return {
            data: null,
            error: error.response?.data?.error || 'An unexpected error occurred. Please try again.'
        };
    }
};

// Onboarding
export const registerUser = (userData) =>
    handleResponse(api.post('/auth/register', userData));

export const setGoal = (goalData) =>
    handleResponse(api.post('/onboarding/goal', goalData));

export const getAssessment = (learner_id) =>
    handleResponse(api.get(`/onboarding/assessment?learner_id=${learner_id}`));

export const submitAssessment = (data) =>
    handleResponse(api.post('/onboarding/assessment/answer', data));

// Dashboard & Leitner
export const getDashboard = (learner_id) =>
    handleResponse(api.get(`/dashboard/${learner_id}`));

export const getDueConcepts = (learner_id) =>
    handleResponse(api.get(`/leitner/due?learner_id=${learner_id}`));

export const updateLeitnerBox = (data) =>
    handleResponse(api.post('/leitner/due', data));

// Episodes & Sandbox
export const getEpisode = (episode_id, is_revision = false, time_available = 30) =>
    handleResponse(api.get(`/episodes/${episode_id}?is_revision=${is_revision}&time_available=${time_available}`));

export const postProgress = (episode_id, data) =>
    handleResponse(api.post(`/episodes/${episode_id}/progress`, data));

export const signalStruggle = (data) =>
    handleResponse(api.post('/struggle/signal', data));

export const executeCode = (data) =>
    handleResponse(api.post('/code/execute', data));

export const getHint = (data) =>
    handleResponse(api.post('/mentor/hint', data));

export const generateSprint = (data) =>
    handleResponse(api.post('/bridge-sprint/generate', data));

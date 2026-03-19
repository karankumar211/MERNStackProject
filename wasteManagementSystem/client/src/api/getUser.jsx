import axios from 'axios'; 

const API_URL = "http://localhost:5000/api/auth/profile"; 

export const getUser = async () => {
    const token = localStorage.getItem("token"); 
    
    if (!token) return null; 

    try {
        const response = await axios.get(API_URL, { 
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data; 
    } catch (error) {
        console.error("Error fetching user profile:", error.response?.data || error.message);
        
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
        }
        
        return null; 
    }
};
import errorMessages from '../../constants/errorMessages';

// returns json data otherwise empty dict
async function apiGet(url){
    try {
        const response = await fetch(url);
        if (response.ok) {
            const responseData = await response.json();
            return responseData;
        } else {
            throw new Error(errorMessages.BACKEND_NOT_OK)
        }
    }
    catch (error) {
        console.error(error);
        document.dispatchEvent(new CustomEvent("error", {detail: error}));
        return {};
    }
}

async function apiPut(obj, url) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(obj)){
        formData.append(key, value);
    }

    try {
        const response = await fetch(url, {
            method: "PUT", 
            body: formData
        });
        if (response.ok){
            return true; 
        } else {
            throw new Error(errorMessages.BACKEND_NOT_OK);
        }
    }
    catch (error){
        console.error(error);
        document.dispatchEvent(new CustomEvent("error", {detail: error}));
        return false;
    }
    
}


async function apiDelete(url){
    try {
        const response = await fetch(url, {
            method: "DELETE"
        });
        if (response.ok){
            return true; 
        } else {
            throw new Error(errorMessages.BACKEND_NOT_OK);
        }
    }
    catch (error){
        console.error(error);
        document.dispatchEvent(new CustomEvent("error", {detail: error}));
        return false;
    }
}

export {apiGet};
export {apiPut};
export {apiDelete};
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

async function apiPost(obj, url) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(obj)){
        formData.append(key, value);
    }

    try {
        const response = await fetch(url, {
            method: "POST", 
            body: formData
        });
        if (response.ok){
            const createdObj = await response.json();
            return createdObj; 
        } else {
            throw new Error(errorMessages.BACKEND_NOT_OK);
        }
    }
    catch (error){
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

async function apiPutMultiple(array,url){
    //must be stringyfiable data
    try {
        const response = await fetch(url, {
            method: "PUT", 
            headers: new Headers({'content-type': 'application/json'}), 
            body: JSON.stringify(array)
        });
        if (response.ok){
            return true; 
        } else {
            throw new Error(errorMessages.BACKEND_NOT_OK);
        }
    } catch (error){
        console.error(error);
        document.dispatchEvent(new CustomEvent("error", {detail: error}));
        return false;
    }
}

export {apiGet};
export {apiPost};
export {apiPut};
export {apiDelete};
export {apiPutMultiple};
import errorMessages from '../constants/errorMessages';

// returns json data otherwise empty dict
async function apiGet(url, token=''){
    const headers = token ? {'Authorization': 'Token ' + token,} : {};
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: new Headers(headers),
        });
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

async function apiPost(obj, url, token='') {
    const formData = new FormData();
    for (const [key, value] of Object.entries(obj)){
        formData.append(key, value);
    }
    const headers = token ? {'Authorization': 'Token ' + token,} : {};
    try {
        const response = await fetch(url, {
            method: "POST", 
            headers: new Headers(headers),
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

async function apiPut(obj, url, token='') {
    const headers = token ? {'Authorization': 'Token ' + token,} : {};
    const formData = new FormData();
    for (const [key, value] of Object.entries(obj)){
        formData.append(key, value);
    }

    try {
        const response = await fetch(url, {
            method: "PUT", 
            headers: new Headers(headers),
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


async function apiDelete(url, token=''){
    const headers = token ? {'Authorization': 'Token ' + token,} : {};
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: new Headers(headers)
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

async function apiPutMultiple(array,url, token=''){
    const headers = token ? {'Authorization': 'Token ' + token, 'content-type': 'application/json'} : {'content-type': 'application/json'};
    //must be stringyfiable data
    try {
        const response = await fetch(url, {
            method: "PUT", 
            headers: new Headers(headers), 
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
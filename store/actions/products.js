import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const EDIT_PRODUCT = 'EDIT_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const response = await fetch('https://rn-complete-guide-eh.firebaseio.com/products.json');

            if(!response.ok){
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            const loadedProducts = [];

            for(const key in resData){
                let currentProduct = resData[key];
                loadedProducts.push(
                    new Product(
                        key, 
                        currentProduct.ownerId, 
                        currentProduct.title,
                        currentProduct.imageUrl,
                        currentProduct.description,
                        currentProduct.price,
                    )
                );
            }
            dispatch({type:SET_PRODUCTS, products: loadedProducts, userProducts: loadedProducts.filter(product => product.ownerId === userId)});
        } catch (error){
            console.log(err);
            throw error;
        }
    };
};



export const deleteProduct = productId => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(
            `https://rn-complete-guide-eh.firebaseio.com/products/${productId}.json?auth=${token}`, 
            {
                method: 'DELETE',
        });

        if(!response.ok){
            throw new Error('Something went wrong!');
        }

        dispatch({type: DELETE_PRODUCT, pid: productId});
    };
}

export const createProduct = (title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(`https://rn-complete-guide-eh.firebaseio.com/products.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
            })
        });

        const resData = await response.json();

        if(!response.ok){
            console.log(resData);
            throw new Error('Something went wrong!');
        }

        dispatch({
            type: CREATE_PRODUCT, 
            productData: {
                id: resData.name,
                title: title,
                description: description,
                imageUrl: imageUrl,
                price: price,
                ownerId: userId
            }
        });
    };

};

export const updateProduct = (id, title, description, imageUrl) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(
            `https://rn-complete-guide-eh.firebaseio.com/products/${id}.json?auth=${token}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl
            })
        });

        if(!response.ok){
            throw new Error('Something went wrong!');
        }

        dispatch({
            type: EDIT_PRODUCT, 
            pid: id, 
            productData: {
                title: title,
                description: description,
                imageUrl: imageUrl
            }
        })
    };
}
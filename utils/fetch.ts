const fetchCall = async <T>(
    url: string,
    method: string = "GET",
    data: Object[] | {} = {},
    headers: Record<string, string> = {}
): Promise<T> => {
    const options: RequestInit = {
        method: method,
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
    };

    if (method !== "GET" && method !== "HEAD") {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    return response.json();
};
export default fetchCall
export const getClient =async () => {
    const res = await fetch(`${process.env.API_URL}client`)
    return res.json().then(data => data)
}
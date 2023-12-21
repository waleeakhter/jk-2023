export const getLogs = async (url: string | undefined, params?: string | undefined) => {
    const _url = url ? url + "logs" : "/api/logs"
    console.log(params)
    const getLogs = await fetch(`${_url}?${params}`, {
        cache: "no-cache",
        next: {
            tags: ["logs"]
        }
    })
    const logs = await getLogs.json().then(logs => logs)
    return logs.data
}
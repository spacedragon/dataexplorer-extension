

export function getAccessKey(): string {
    for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index)
        if (key.startsWith("{\"") &&  key.endsWith("}")) {
            try {
                const keyObj = JSON.parse(key);
                const scope = keyObj["scopes"];
                if (scope) {
                    if (scope.startsWith("https://help.kusto.windows.net/user_impersonation")) {
                        const value = JSON.parse(localStorage.getItem(key));
                        return value.accessToken;
                    }
                }
            } catch (e) {
                continue
            }
        }
    }
}

export async function executeQuery(cluster: string, db: string, query: string) {
    const url = `https://${cluster}.kusto.windows.net/v2/rest/query`;
    const body = JSON.stringify({
        csl: query,
        db,
        properties: {
            Options: {
                query_language: "csl",
                queryconsistency: "strongconsistency",
                servertimeout: "00:04:00"
            }
        }
    });
    const response = await fetch(url, {
        method: "POST",
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${getAccessKey()}`
          },
        redirect: 'follow',
        body
    })
    if (response.ok) {
        const results = await response.json();
        if (Array.isArray(results)) {
            const primaryResult = results.find(r => r.TableName === "PrimaryResult");
            if (primaryResult) {
                return toResult(primaryResult)
            }
        }
        return []
    } else {
        throw `execute query failed. code: ${response.status} query: ${query}`
    }
}

function toResult(table: any): any[] {
    const columns = table.Columns;
    return table.Rows.map(row => {
        const r = {};
        columns.forEach((col, idx) => {
            r[col.ColumnName] = row[idx]
        });
        return r;
    })
}
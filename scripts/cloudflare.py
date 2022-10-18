"""
 Description: generates a table of links to past deployments on cloudflare pages
 Author: LukeGrahamLandry
 License: CC0, https://creativecommons.org/share-your-work/public-domain/cc0/
 Setup: pip3 install requests
 Args: <template html file path, table code replaces "TABLE"> <output file path> <github id: "UserName/RepoName">
 Environment Variables: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_PAGES_PROJECT_NAME
"""

import os, sys, requests

def getSecrets(*secret_keys):
    secret_values = []

    for key in secret_keys:
        if key not in os.environ:
            print("cloudflare.py missing environment variable {}".format(key))
        else:
            secret_values.append(os.environ[key])

    if len(secret_keys) != len(secret_values):
        return False
    else:
        return secret_values


def cloudflareApi(url):
    api_token = getSecrets("CLOUDFLARE_API_TOKEN")[0]
    
    r = requests.get(url, headers={
        "Authorization": "Bearer " + api_token,
        "Content-Type": "application/json"
    })

    # TODO: handle errors gracefully 

    return r.json()["result"]


def fetchPastPagesDeployments():
    secrets = getSecrets("CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_PAGES_PROJECT_NAME")
    if not secrets:
        print("skipping generateCloudflarePagesTable")
        return
    token, account_id, project_name = secrets

    api_url = "https://api.cloudflare.com/client/v4/accounts/{}/pages/projects/{}/deployments".format(account_id, project_name)
    deployments = cloudflareApi(api_url)

    deployment_table_data = []
    last_message = ""
    for build in deployments:
        replacements = {
            "PAGE_URL": build["url"],
            "COMMIT_HASH": build["deployment_trigger"]["metadata"]["commit_hash"],
            "SHORT_HASH": build["deployment_trigger"]["metadata"]["commit_hash"][0:7],
            "COMMIT_MESSAGE": build["deployment_trigger"]["metadata"]["commit_message"],
            "DATE": build["latest_stage"]["started_on"].split("T")[0]
        }

        if replacements["COMMIT_MESSAGE"] == last_message:
            continue
        
        last_message = replacements["COMMIT_MESSAGE"]
        deployment_table_data.append(replacements)

    print("Found {} cloudflare pages deployments, {} have unique names.".format(len(deployments), len(deployment_table_data)))
    
    return deployment_table_data


def generatePagesTable(deployments, template_file, output_file, github_id):
    # TODO if i decide to open source, include Code: https://github.com/GITHUB_PROJECT_ID/archive/COMMIT_HASH.zip
    table_code = "<table> <tr> <th> Commit Message </th> <th> Hash </th> <th> Date </th> <th> Link </th>"
    row_template = """
        <tr>
            <td> COMMIT_MESSAGE </td>
            <td> <a href="https://github.com/GITHUB_PROJECT_ID/commit/COMMIT_HASH" target="_blank"> SHORT_HASH </a> </td>
            <td> DATE </td>
            <td> <a href="PAGE_URL" target="_blank"> Open Site </a> </td>
        </tr>
        """.replace("GITHUB_PROJECT_ID", github_id)
        
    for replacements in deployments:
        row_code = row_template

        for key, value in replacements.items():
            row_code = row_code.replace(key, value)
        
        table_code += row_code

    table_code += "</table>"

    with open(template_file, "r") as f:
        template_code = "".join(f.readlines())
    
    with open(output_file, "w") as f:
        f.write(template_code.replace("TABLE", table_code))


if __name__ == "__main__":
    script_file, template_file, out_file, github_project = sys.argv

    generatePagesTable(fetchPastPagesDeployments(), template_file, out_file, github_project)

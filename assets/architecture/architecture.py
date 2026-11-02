from pathlib import Path

import diagrams
from diagrams import Diagram
from diagrams.aws.general import User
from diagrams.aws.network import CloudFront, Route53
from diagrams.aws.storage import S3
from diagrams.onprem.ci import GithubActions
from diagrams.onprem.iac import Terraform


icons_root = Path(diagrams.__file__).resolve().parent.parent
github_actions_icon = icons_root / GithubActions._icon_dir / GithubActions._icon
terraform_icon = icons_root / Terraform._icon_dir / Terraform._icon

footer = f'''<<TABLE BORDER="0" CELLBORDER="0" CELLSPACING="8" CELLPADDING="0">
    <TR><TD COLSPAN="5">&lt;insert_parameter&gt; Website Architecture</TD></TR>
    <TR><TD COLSPAN="5" HEIGHT="18"></TD></TR>
    <TR>
        <TD WIDTH="36" HEIGHT="36" FIXEDSIZE="TRUE"><IMG SRC="{github_actions_icon}" SCALE="TRUE"/></TD>
        <TD>GitHub Actions CI/CD</TD>
        <TD WIDTH="36">+</TD>
        <TD WIDTH="36" HEIGHT="36" FIXEDSIZE="TRUE"><IMG SRC="{terraform_icon}" SCALE="TRUE"/></TD>
        <TD>Terraform Infrastructure as Code</TD>
    </TR>
</TABLE>>'''


with Diagram(
    "<insert_parameter> Website Architecture",
    filename=str(Path(__file__).resolve().with_name("aws-static-website")),
    outformat="png",
    show=False,
    direction="LR",
    graph_attr={"ranksep": "1.5", "label": footer, "labelloc": "b"},
):
    visitors = User("Website Visitors")
    dns_and_tls = Route53("Route 53 + ACM\n(DNS and TLS certificate)")
    distribution = CloudFront(
        "Amazon CloudFront\n(HTTPS, caching, and\ncontent delivery)"
    )
    assets = S3(
        "Private Amazon S3\n(Static website assets via\norigin access control)"
    )

    visitors >> dns_and_tls >> distribution >> assets

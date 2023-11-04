from transformers import AutoModel
from numpy.linalg import norm


def cos_sim(a, b):
    return (a @ b.T) / (norm(a) * norm(b))


model = AutoModel.from_pretrained(
    'jinaai/jina-embeddings-v2-base-en', trust_remote_code=True)

# Define your preferences
positive_preferences = {
    # "growing": 2.0,
    # "profitable": 1.5,
    # "revenue": 1.5,
    # 'bootstrapped': 1.5,
    "traction seed fund distributed early stage senior full-stack engineers fully remote first based in europe timezone typescript python postgres node javascript": 2.0,
    # 'fully remote': 2.0,
    # "remote-first": 2.0,
    # 'typescript': 1.5,
    # 'python': 1.2,
    # 'europe': 1.2,
    # "postgres": 1.5,
    # "node": 1.5,
    # "javascript": 1.5,
}
negative_preferences = {
    # 'hybrid': 2.5,
    # "ONSITE": 2.5,
    # 'only on site': 2.5,
    # 'only united states': 3.0,
    # "react native": 1.5,
    # "mysql": 1.5,
    # "redux": 1.5,
    # "angular": 1.5,
    # "mongodb": 1.5,
    # "ruby": 1.5,
    # 'rails': 1.5,
    # "java": 1.5,
    # "crypto": 1.5,
    # "blockchain": 1.5,
    # "web3": 1.5,
    # "ember": 1.5,
    'onsite or hybrid in the office go java c++ rust rails ruby mongodb web3 ember crypto angular redux mysql united states timezone only': 2.0,
}

# Define a list of job ads to rank
# job_ads = [
#     "at friendly captcha we do one thing and we do it well: we protect websites from malicious actors and bots. we provide privacy-friendly and accessible anti-bot solutions that don’t annoy users with tasks like clicking fire hydrants. we make the internet a bit better every day by winning over customers currently using google recaptcha. we’re a fast-growing, profitable, fully bootstrapped company. our revenue mostly comes from medium to large european enterprise and governments. we're accepting applications from talented and motivated interns who like to actually participate and build great things, not just fetch coffee or work on a nice-to-have project. this is a paid internship. a great fit would be someone who loves to learn and who liked to learn and build things outside of their studies too. our engineering team is remote across europe, but for this position we propose to meet in-person for work 3 days per week in utrecht, the netherlands. fully remote is difficult we think for junior developers. stack: go | typescript | clickhouse | postgres | redis | python ml/data science stack form with more information: https://tally.so/r/wa44q9 - or e-mail me guido @ company domain. ",
#     "our mission is to enhance the sustainability, resilience, and robustness of the global metal supply chain while minimizing its carbon footprint. rematter is a scrap metal recycling software company founded by forbes 30 under 30 stanford grads, building modern solutions for the $100b+ scrap metal industry. our stack includes typescript, react, node, graphql, aws lambda, cognito, s3, rds, github actions, and docker. experience with our stack is a plus, but we believe in your ability to learn new technologies quickly. join us to create a meaningful impact on the lives of recyclers. we offer competitive salary, meaningful equity, flexible schedules, remote work, and engaging company events. apply at: - sr. product manager: https://rematter.com/careers/?ashby_jid=99e79271-47d0-415b-a... - mobile software engineer: https://rematter.com/careers/?ashby_jid=e78089d3-542c-4c6b-9... - devops engineer: https://rematter.com/careers/?ashby_jid=eae31e1a-794f-4149-9... if you don't see a position on our site that fits your skillset or interests, reach out to jobs 'at' rematter.com",
#     "we build a platform for ai-assisted medical diagnosis and clinical decision-making. doctors spend twice as much time with computers as they do with patients; our product helps doctors make decisions and draft documentation in seconds. to date, tens of thousands of clinicians have used glass to generate drafts of differential diagnoses and clinical plans. we went through y combinator this year and recently announced a $5m seed round led by initialized, which included some of the most brilliant founders in healthtech: tom lee, founder of one medical; connor landgraf, founder and ceo of eko health; and heather hasson and trina spear, the co-founders of figs. we’ve also been featured in leading clinical lectures like ucsf grand rounds and news outlets like npr and techcrunch. this is a hybrid role: we work in person at an office in san francisco two days a week. remote is optional for the remaining days, although the office space is fully available at any time! unfortunately, we are unable to offer visa sponsorship at this time. i graham previously worked at modern fertility yc s19 and our ceo/my co-founder dereck is a doctor who studied medicine at ucsf and brigham and women's hospital. join us! tech stack: django, typescript, react, redux, postgres apply on lever here: https://jobs.lever.co/glass-health-inc/a2cd06e1-e362-4204-ae... ",
#     "credcore is a well-funded early-stage startup based out of new york city building solutions for the $10 trillion us debt sector. our product suite helps funds and companies navigate the complex landscape of corporate debt deals and make better decisions with ai-assisted data analysis. we're hiring for two roles: 1. ux/ui engineer with a keen eye for detail, good at unifying design and code. expertise in react, typescript, storybook, and figma is required. 2. ai/ml engineer. deep knowledge of nlp and llms is required. your work will involve algorithmically extracting information from large volumes of financial agreements and deals, fine tuning models etc. we offer a competitive salary with equity, a remote-first work environment, and health insurance coverage. please email your resume to jeswin@credcore.com ",
#     "uncountable accelerates r&d for industrial scientists across leading materials, chemicals, and life sciences organizations. with our saas solution, our customers get better products to the market in half the time. uncountable was founded by mit and stanford engineers and has been profitable since 2016. our team has grown from 20 to 50 over the last two years. full-stack engineers | $120k - $220k + equity ---> uncountable is looking for engineers who can spearhead the development of the uncountable web platform. the position is heavily product-driven and comes with challenges across the stack. --> senior and principal positions are available. --> summer internships and working student positions are also available. learn more: https://www.uncountable.com/hiring/hn uncountable has offices in san francisco, new york city or munich. remote flexibility is available for senior candidates within the sf or ny metro areas. contact our cto directly at jason@uncountable.com ",
#     "leagueapps is a youth sports management saas. we help youth sports organizers run their business, providing the tools they need to manage registration, scheduling, payments, and more. we believe that every kid should have the opportunity to play, and we provide 1% of our revenue to youth sports accessibility. we're hiring an engineering manager: https://grnh.se/3948b0e73us $144,500 - $212,500, plus equity find other roles on our job board: https://grnh.se/0b718ab43us you can also use this link to join our talent community, and our recruiters will reach out when new positions become available: https://grnh.se/b1bedbd53us these links are all referral links, but you can also apply via https://careers.leagueapps.com/ ",
#     "* must be available during all us east coast business hours. we're a vc-funded startup building an automation platform for construction companies. our mission is to modernize the industry using a mix of generative ai and industry specific software, applications of llms are abundant. my team is looking for a founding software engineer to make core contributions to the platform. the scope is quite broad, and you'll get to work on all layers of the stack. we prefer mid-level to senior candidates, but are open minded to all applicants. we are very early, the product roadmap is an ever evolving document. base range: $140k+, equity our technical stack is aws/cdk, spring boot/java backend, react/typescript frontend, postgres. apply via: ycapplicants@gmail.com",
#     "we’re a well-funded startup building a solution to streamline the online shopping experience, guiding customers to their ideal product choice using conversational agents. essentially, our vision is to replicate the experience of in-store expert shopping advisors, but online. we’ve launched our product and already have paying clients. so far we are growing substantially fast 4x revenue from past quarter and our biggest bottleneck is product development speed. we are looking for a generalist that is capable of quickly building web apps, integrations, scrapers, and algorithms. additionally, interest/experience in llm applications and/or information retrieval systems is preferred, yet not required. we don’t have a strict requirement for experience or education; candidates will be judged on merit speed, skills, intelligence. stack: typescript, react, serverless, postgresql. interested? lukas [at] octocom.ai ",
# ]
# load job ads from a file
with open('../scraper/november-2023.txt', 'r') as f:
    job_ads = f.readlines()


# Encode your positive preferences and the job ads using the pre-trained model
positive_preference_embeddings = [model.encode(
    [preference])[0] for preference in positive_preferences]
job_ad_embeddings = model.encode(job_ads)

# Calculate the cosine similarity between each positive preference and each job ad
positive_similarity_scores = []
for positive_preference, weight in positive_preferences.items():
    positive_preference_embedding = model.encode([positive_preference])[0]
    positive_similarity = [cos_sim(
        positive_preference_embedding, embedding) for embedding in job_ad_embeddings]
    # Scale the positive similarity scores by the assigned weight
    scaled_positive_similarity = [similarity *
                                  weight for similarity in positive_similarity]
    positive_similarity_scores.append(scaled_positive_similarity)

# Calculate the cosine similarity between each negative preference and each job ad
negative_similarity_scores = []
for negative_preference, weight in negative_preferences.items():
    negative_preference_embedding = model.encode([negative_preference])[0]
    negative_similarity = [cos_sim(
        negative_preference_embedding, embedding) for embedding in job_ad_embeddings]
    # Scale the negative similarity scores by the assigned weight
    scaled_negative_similarity = [similarity *
                                  weight for similarity in negative_similarity]
    negative_similarity_scores.append(scaled_negative_similarity)

# Calculate the final similarity score by summing positive and negative scores
final_similarity_scores = [sum(positive_scores) - sum(negative_scores) for positive_scores,
                           negative_scores in zip(zip(*positive_similarity_scores), zip(*negative_similarity_scores))]

# Sort the job ads by their final similarity score in descending order
ranked_job_ads = [job_ad for _, job_ad in sorted(
    zip(final_similarity_scores, job_ads), reverse=True)]

# Print the ranked job ads
# iterate and print the ranked job ads with their similarity score

for i, job_ad in enumerate(ranked_job_ads):
    print(f'{i+1}. {job_ad}')
    print(f'Similarity Score: {final_similarity_scores[i]}')
    print()

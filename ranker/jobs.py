with open('../scraper/august-2025.txt', 'r') as f:
    job_ads = f.readlines()

# iterate through job ads and extract locations
job_ads = [job_ad.strip() for job_ad in job_ads]  # remove trailing whitespace
job_ads = [job_ad for job_ad in job_ads if job_ad]  # remove empty lines

# export job_ads

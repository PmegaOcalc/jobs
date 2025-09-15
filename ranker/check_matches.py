from jobs import job_ads

count_onsite = 0
count_remote = 0
count_neither = 0
count_hybrid = 0
ads_neither = []

# iterate job ads
for job_ad in job_ads:
    # check if "onsite" or "remote" is in the job ad
    # count how many job ads have "onsite" or "remote"

    some_category = False
    if "onsite" in job_ad:
        # print("onsite")
        some_category = True
        count_onsite += 1
    if "remote" in job_ad:
        # print("remote")
        count_remote += 1
        some_category = True
    if "hybrid" in job_ad:
        count_hybrid += 1
        some_category = True

    if not some_category:
        count_neither += 1
        ads_neither.append(job_ad)


# count all ads
total_ads = job_ads.__len__()

# print the results
print(f"onsite: {count_onsite / total_ads * 100:.2f}%")
print(f"remote: {count_remote / total_ads * 100:.2f}%")
print(f"hybrid: {count_hybrid / total_ads * 100:.2f}%")
print(f"neither: {count_neither / total_ads * 100:.2f}%")
# how many have multiple categories?
print(
    f"multiple: {(total_ads - count_onsite - count_remote - count_neither - count_hybrid) / total_ads * 100:.2f}%")

# add all counts
print(
    f"total: {count_onsite + count_remote + count_neither + count_hybrid} / {total_ads}")
print()
# print neither job ads
for ad in ads_neither:
    print(ad)
    print()

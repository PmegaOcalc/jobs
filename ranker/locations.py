import spacy
from jobs import job_ads

# Load SpaCy NER model
nlp = spacy.load("en_core_web_sm")


def extract_locations(text):
    doc = nlp(text)
    locations = []
    print(doc.ents)
    for ent in doc.ents:
        # GPE represents geopolitical entities (locations)
        if ent.label_ == "GPE":
            locations.append(ent.text)
    return locations


# iterate through job ads and extract locations
extracted_locations = [extract_locations(job_ad) for job_ad in job_ads]

# if location is united states, add to negative preferences

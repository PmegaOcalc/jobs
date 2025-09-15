import spacy
from spacy.matcher import Matcher
from jobs import job_ads

# Load English tokenizer, tagger, parser, NER and word vectors
nlp = spacy.load("en_core_web_sm")

# Initialize the matcher with the shared vocab
matcher = Matcher(nlp.vocab)

# Define pattern for "onsite" or "on-site"
pattern1 = [{"LOWER": "on"}, {"IS_PUNCT": True, "OP": "?"}, {"LOWER": "site"}]

# Define pattern for "remote"
pattern2 = [{"LOWER": "remote"}]

pattern3 = [{"LOWER": "hybrid"}]


# Add patterns to the matcher
matcher.add("ONSITE", [pattern1])
matcher.add("REMOTE", [pattern2])
matcher.add("REMOTE", [pattern3])

# Define your text
text = "burnley football club | product manager | burnley lancashire uk | full time | on site do you want to help build the football club of the future? with big ambitions to reinvent how a football club is run, i'm looking to hire a product manager in a new technology department to work in every area of the football club. hr, medical, retail, stadium hardware and more. it's a full stack technology job. initially building partnerships and then custom tech it's exposure from the ground up in a startup like environment. if you're interested in complex and high performance businesses and working in focused commercial businesses then this is a big challenge. apply here https://careers.burnleyfootballclub.com/job/523819 or reply to this comment and i'll answer any questions you have."
# Process the text
doc = nlp(text)

# Find matches in the doc
matches = matcher(doc)

# Iterate over the matches
for match_id, start, end in matches:
    # Get the matched span
    span = doc[start:end]
    # Get the category
    category = nlp.vocab.strings[match_id]
    # Print the category and the matched text
    print(category, span.text)

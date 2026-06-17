import os
import pandas as pd

def generate_data():
    os.makedirs("ml-service/dataset", exist_ok=True)
    
    # Real news samples
    real_news = [
        {
            "title": "Government announces new economic policies to boost growth",
            "text": "The official spokesperson announced that the government has launched a series of economic reforms. These reforms aim to improve fiscal growth, support local businesses, and stabilize inflation. Parliament approved the bill early this morning.",
            "subject": "politics",
            "date": "June 15, 2026"
        },
        {
            "title": "Health authorities approve new vaccine for public use",
            "text": "Scientists and health officials have officially approved the new vaccine after rigorous clinical trials. The medical study published in the peer-reviewed journal confirms that it has a high efficacy rate and is safe for general distribution.",
            "subject": "health",
            "date": "June 14, 2026"
        },
        {
            "title": "Central bank holds interest rates steady amid market stability",
            "text": "In the latest monetary policy committee meeting, the central bank decided to maintain the interest rates. Economists noted that low inflation and steady employment numbers contributed to this decision.",
            "subject": "economy",
            "date": "June 12, 2026"
        },
        {
            "title": "Global climate summit reaches historic agreement on emissions",
            "text": "Delegates from over 190 countries have signed an agreement to reduce greenhouse gas emissions by 30% over the next decade. The agreement focuses on investing in renewable energy sources and phase-out of coal-fired power plants.",
            "subject": "environment",
            "date": "June 10, 2026"
        }
    ] * 20  # Duplicate to create a larger sample dataset
    
    # Fake news samples
    fake_news = [
        {
            "title": "Shocking truth: Aliens control the global banking system!",
            "text": "Unbelievable secret documents leaked by anonymous hackers show that extraterrestrial beings are running all central banks. Do not trust the mainstream media, they are hiding the truth. Share this post before it gets deleted!",
            "subject": "conspiracy",
            "date": "June 15, 2026"
        },
        {
            "title": "Miracle water cures all diseases in 24 hours - Doctors are furious!",
            "text": "Big pharma companies do not want you to know about this cheap miracle fluid. Drinking this special ionized water cures cancer, diabetes, and heart disease instantly. The medical establishment is trying to ban it!",
            "subject": "health",
            "date": "June 14, 2026"
        },
        {
            "title": "Leaked video shows prominent politician shape-shifting",
            "text": "A viral video circulating on social media shows a leading politician's face morphing during a live interview. Experts who refuse to be named say it is proof of reptilian shapeshifters controlling the government. Watch now!",
            "subject": "politics",
            "date": "June 11, 2026"
        },
        {
            "title": "Elections completely rigged by secret deep state computer chip",
            "text": "A secret source claims that a tiny microchip installed in all voting machines changed millions of votes. The deep state is orchestrating the entire system to select their puppets. Wake up people, democracy is a lie!",
            "subject": "politics",
            "date": "June 09, 2026"
        }
    ] * 20  # Duplicate to create a larger sample dataset
    
    df_true = pd.DataFrame(real_news)
    df_fake = pd.DataFrame(fake_news)
    
    df_true.to_csv("ml-service/dataset/True.csv", index=False)
    df_fake.to_csv("ml-service/dataset/Fake.csv", index=False)
    print("Sample datasets created successfully:")
    print(f"True.csv shape: {df_true.shape}")
    print(f"Fake.csv shape: {df_fake.shape}")

if __name__ == "__main__":
    generate_data()

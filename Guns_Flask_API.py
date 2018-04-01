
# coding: utf-8

# In[4]:

# Dependencies
import pandas as pd
import numpy as np
import os


# # Data Cleaning

# In[5]:

# Path of the CSV file
csvfile = "gun_data_07_16.csv"


# In[6]:

# Read CSV file into a pandas DataFrame
df = pd.read_csv(csvfile, dtype=object)
mortality_df = pd.read_csv("mortalitybystate.csv", dtype=object)
gundata_df = pd.read_csv('gundata_final.csv', dtype=object)
total_gun_deaths_df = pd.read_csv("total_gun_deaths.csv", dtype=object)
# In[7]:

df = df.iloc[:,2:]


# In[8]:

df = df.dropna(axis=0)
df.head()


# In[9]:

df[["County Code","Deaths"]] = df[["County Code","Deaths"]].astype(float).astype(int)


# In[10]:

gundata_df['gun_deaths'] = gundata_df['gun_deaths'].astype(float)


# In[11]:

# Save the cleaned data to a file called `customers_cleaned.csv`
new_csv = "clean_gun_data_07_16.csv"
df.to_csv(new_csv, index=False)


# # Database Creation

# In[12]:

# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy import create_engine, MetaData, inspect
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Numeric, Text, Float, Date
from sqlalchemy.orm import Session
import sqlite3


# In[13]:

# Create an engine to a SQLite database file called `customers.sqlite`
engine = create_engine("sqlite:///gun_data.sqlite")


# In[14]:

# Create a connection to the engine called `conn`
conn = engine.connect()


# In[15]:

Base = declarative_base()

class gunData(Base):
    __tablename__ = 'Mass_Shootings'

    id = Column(Integer, primary_key=True)
    year = Column(Text)
    month = Column(Text)
    month_code = Column(Text)
    county = Column(Text)
    county_code = Column(String)
    deaths = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)   


# In[16]:

# Use `create_all` to create the shooting table in the database
Base.metadata.create_all(engine)


# In[17]:

# Load the cleaned csv file into a pandas dataframe
new_df = pd.read_csv("clean_gun_data_07_16.csv")


# In[18]:

session = Session(bind=engine)
conn = sqlite3.connect('gunData.sqlite')
cur = conn.cursor()


# In[19]:

new_df.to_sql('Mass_Shootings',con=engine, index=False, if_exists="replace")
mortality_df.to_sql('mortalityState', con=engine, index=False, if_exists="replace") 
gundata_df.to_sql('gunDataFinal', con=engine, index=False, if_exists="replace")
total_gun_deaths_df.to_sql('totalGunDeaths', con=engine, index=False, if_exists="replace") 


# In[20]:

session.commit()


# In[21]:

engine.execute("select * from Mass_Shootings").fetchall()


# In[22]:

pd.read_sql('Mass_Shootings', con=engine)


# In[25]:

from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route("/")
def index(): 
    return render_template ("index.html")

@app.route('/gunData')
def metadata(): 
    record = pd.read_sql('Mass_Shootings', con=engine).to_dict("records")
    return jsonify(record)

@app.route('/mortalityState')
def mortality(): 
    record = pd.read_sql('mortalityState', con=engine).to_dict("records")
    return jsonify(record)

@app.route('/gunDataFinal')
def gunFinal(): 
    record = pd.read_sql('gunDataFinal', con=engine).to_dict("records")
    return jsonify(record)

@app.route('/timePeriod')
def timeSeries(): 
    record = pd.read_sql('''select "Month Code" from Mass_Shootings''', con=engine).to_dict("records")
    return jsonify(record)

@app.route('/totalGunDeaths')
def totalGunDeaths(): 
    record = pd.read_sql('totalGunDeaths', con=engine).to_dict("records")
    return jsonify(record)

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000, debug=True)


# In[ ]:




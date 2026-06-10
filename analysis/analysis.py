import numpy as np
import pandas as pd

def clean_val(obj):
    if isinstance(obj, dict):
        return {k: clean_val(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_val(x) for x in obj]
    elif isinstance(obj, (float, np.floating)) and (obj != obj or obj == float('inf') or obj == float('-inf')):
        return None
    return obj


def coloums_checker(col):
    if pd.api.types.is_numeric_dtype(col):
        return "numeric"
    elif pd.api.types.is_string_dtype(col):
        return "categorical"
    elif pd.api.types.is_datetime64_any_dtype(col):
        return "datetime"
    elif pd.api.types.is_bool_dtype(col):
        return "boolean"
    else:
        return "unknown"


def data_analysis(data):

    # STEP 1: COLUMN TYPE MAP
    map = {}
    for col in data.columns:
        map[col] = coloums_checker(data[col])

    # STEP 2: FILTER COLUMNS
    data = data.loc[:, data.isnull().mean() < 0.6]

    # STEP 3: GROUP COLUMNS
    filtered_map = {}

    for key, value in map.items():
        if key in data.columns:
            if value not in filtered_map:
                filtered_map[value] = []
            filtered_map[value].append(key)

    # STEP 4: NUMERIC SUMMARY
    numeric_summary = {}

    for col, values in filtered_map.items():
        if col == "numeric":
            for val in values:
                if val not in numeric_summary:
                    numeric_summary[val] = {}

                count_val = data[val].count()
                mean_val = data[val].mean()
                median_val = data[val].median()
                std_val = data[val].std()
                min_val = data[val].min()
                max_val = data[val].max()

                numeric_summary[val]["count"] = int(count_val) if pd.notnull(count_val) else 0
                numeric_summary[val]["mean"] = float(mean_val) if pd.notnull(mean_val) else None
                numeric_summary[val]["median"] = float(median_val) if pd.notnull(median_val) else None
                numeric_summary[val]["std"] = float(std_val) if pd.notnull(std_val) else None
                numeric_summary[val]["min"] = float(min_val) if pd.notnull(min_val) else None
                numeric_summary[val]["max"] = float(max_val) if pd.notnull(max_val) else None

    # STEP 5: CATEGORICAL SUMMARY
    categorical_summary = {}

    for col, values in filtered_map.items():
        if col == "categorical":
            for val in values:
                if val not in categorical_summary:
                    categorical_summary[val] = {}

                count_val = data[val].count()
                unique_val = data[val].nunique()
                
                # Safe frequency calculation
                freq_val = 0
                if not data[val].empty:
                    vc = data[val].value_counts()
                    if not vc.empty:
                        freq_val = int(vc.iloc[0])

                # Safe mode calculation
                mode_series = data[val].mode()
                most_frequent_val = str(mode_series.iloc[0]) if not mode_series.empty else None

                categorical_summary[val]["count"] = int(count_val) if pd.notnull(count_val) else 0
                categorical_summary[val]["unique"] = int(unique_val) if pd.notnull(unique_val) else 0
                categorical_summary[val]["freq"] = freq_val
                categorical_summary[val]["most_frequent"] = most_frequent_val

    # STEP 6: DATETIME SUMMARY
    datetime_summary = {}

    for col, values in filtered_map.items():
        if col == "datetime":
            for val in values:
                if val not in datetime_summary:
                    datetime_summary[val] = {}

                count_val = data[val].count()
                start_val = data[val].min()
                end_val = data[val].max()

                datetime_summary[val]["count"] = int(count_val) if pd.notnull(count_val) else 0
                datetime_summary[val]["start"] = str(start_val) if pd.notnull(start_val) else None
                datetime_summary[val]["end"] = str(end_val) if pd.notnull(end_val) else None

    # MISSING SUMMARY
    missing_summary = {}

    for col in data.columns:
        missing_summary[col] = {}
        missing_summary[col]["missing_count"] = int(data[col].isnull().sum())
        missing_summary[col]["missing_percent"] = float(round(data[col].isnull().mean() * 100, 2))

    # Convert dataframe records to dictionaries
    data_records = data.to_dict(orient="records")

    result = {
        "numeric_summary": numeric_summary,
        "categorical_summary": categorical_summary,
        "datetime_summary": datetime_summary,
        "missing_summary": missing_summary,
        "filtered_map": filtered_map,
        "data": data_records
    }

    return clean_val(result)
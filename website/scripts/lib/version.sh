#!/usr/bin/env bash

# Function to extract major version
get_major_version() {
    local version="${1#v}"
    echo "${version%%.*}"
}

# Function to extract minor version
get_minor_version() {
    local version="${1#v}"
    version="${version#*.}"
    echo "${version%%.*}"
}

# Function to extract patch version
get_patch_version() {
    local version="${1#v}"
    version="${version#*.*.}"
    echo "${version%%[^0-9]*}"
}

# Function to compare versions
version_compare() {
    local v1="${1#v}" v2="${2#v}"
    
    # Compare major versions
    local v1_major v2_major
    v1_major=$(get_major_version "$v1")
    v2_major=$(get_major_version "$v2")
    
    if (( v1_major > v2_major )); then
        return 1
    elif (( v1_major < v2_major )); then
        return 2
    fi
    
    # Compare minor versions
    local v1_minor v2_minor
    v1_minor=$(get_minor_version "$v1")
    v2_minor=$(get_minor_version "$v2")
    v1_minor=${v1_minor:-0}
    v2_minor=${v2_minor:-0}
    
    if (( v1_minor > v2_minor )); then
        return 1
    elif (( v1_minor < v2_minor )); then
        return 2
    fi
    
    # Compare patch versions
    local v1_patch v2_patch
    v1_patch=$(get_patch_version "$v1")
    v2_patch=$(get_patch_version "$v2")
    v1_patch=${v1_patch:-0}
    v2_patch=${v2_patch:-0}
    
    if (( v1_patch > v2_patch )); then
        return 1
    elif (( v1_patch < v2_patch )); then
        return 2
    fi
    
    return 0
}
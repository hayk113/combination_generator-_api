class CombinationGenerator {
    // Generates items based on the number of counts provided for each letter
    static generateItems(itemCounts) {
        const items = [];
        let letterIndex = 0;

        for (let i = 0; i < itemCounts.length; i++) {
            const count = itemCounts[i];
            const letter = String.fromCharCode(65 + letterIndex); // A, B, C, ...

            for (let j = 1; j <= count; j++) {
                items.push(`${letter}${j}`); // Add items like A1, A2, B1, etc.
            }
            letterIndex++;
        }

        return items;
    }

    // Checks if a combination is valid (no duplicate letter prefixes)
    static isValidCombination(combination) {
        const prefixes = new Set();
        for (const item of combination) {
            const prefix = item.charAt(0);
            if (prefixes.has(prefix)) return false; // Duplicate prefix found
            prefixes.add(prefix);
        }
        return true;
    }

    // Generates all valid combinations of a given length from the list of items
    static generateValidCombinations(allItems, length) {
        const combinations = [];

        // Helper function for backtracking through possible combinations
        function backtrack(start, current) {
            if (current.length === length) {
                if (CombinationGenerator.isValidCombination(current)) {
                    combinations.push([...current]); // Add valid combination
                }
                return;
            }

            for (let i = start; i < allItems.length; i++) {
                current.push(allItems[i]); // Add current item to combination
                backtrack(i + 1, current); // Recurse with next item
                current.pop(); // Remove current item to try next possibility
            }
        }

        backtrack(0, []); // Start backtracking with an empty combination
        return combinations;
    }
}


module.exports = CombinationGenerator;

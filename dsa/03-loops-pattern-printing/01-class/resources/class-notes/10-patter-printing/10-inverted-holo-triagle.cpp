#include <iostream>

using namespace std;

int main() {
    int n;
    cin >> n;

    for (int i = 1; i <= n; i++) {

        // leading spaces
        for (int s = 1; s < i; s++) {
            cout << " ";
        }

        for (int j = 1; j <= n - i + 1; j++) {
            if (i == 1 || j == 1 || j == n - i + 1)
                cout << "* ";
            else
                cout << "  ";
        }

        cout << '\n';
    }

    return 0;
}
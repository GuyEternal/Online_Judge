#include <bits/stdc++.h>
#define endl "\n"
#define ll long long int
#define ull unsigned long long
#define vi vector<int>
#define vll vector<ll>
#define vvi vector < vi >
#define pii pair<int,int>
#define pll pair<long long, long long>
#define mod 1000000007
#define inf 1000000000000000001;
#define all(c) c.begin(),c.end()
#define mem(a,val) memset(a,val,sizeof(a))
#define f first
#define s second
using namespace std;

void solve() {
    int n;
    cin >> n;
    vi a(n), b(n);
    for (int i = 0; i < n; i++){
        cin >> a[i];
    }
    for (int i = 0; i < n; i++){
        cin >> b[i];
    }

    unordered_map<int, deque<int>> mp;
    unordered_set<int> s;
    for (int i = 0; i < n; i++) {
        if (b[i] == a[i]) {
            mp[b[i]].push_back(i);
        }

    }
    for (int i = 0; i < n; i++) {
        if (b[i] != a[i]) {
            mp[b[i]].push_back(i);
        }
    }
    int m;
    cin >> m;
    int mods = 0;
    bool flag = true;
    for (int i = 0; i < m; i++) {
        int d;
        cin >> d;
        if (mp[d].empty()) {
            mods++;
            continue;
        }
        mp[d].push_front(mp[d].back());
        mods = 0;
        a[mp[d].back()] = d;
        mp[d].pop_back();
    }
    for (int i = 0; i < n; i++) {
        if (a[i] != b[i] || mods != 0) {
            cout << "NO" << endl;
            return;
        }
    }
    cout << "YES" << endl;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    ll T = 1;
    cin >> T;
    while (T--) {
        solve();
    }
    return 0;
}